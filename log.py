def myLog(x, b):
	a = 0
	while b**a <= x:
		a += 1

	return a-1



def laceStrings(s1, s2):

	r = ""
	i = 0
	for i in range(min(len(s1), len(s2))):
		r = r + s1[i] + s2[i]

	return r + s1[i+1:len(s1)] + s2[i+1:len(s2)]



def laceStringsRecur(s1, s2):
    """
    s1 and s2 are strings.

    Returns a new str with elements of s1 and s2 interlaced,
    beginning with s1. If strings are not of same length, 
    then the extra elements should appear at the end.
    """
    def helpLaceStrings(s1, s2, out):
        if s1 == '':
            return s2
        if s2 == '':
            return s1
        else:
            return s1[0] + s2[0] + helpLaceStrings(s1[1:len(s1)], s2[1:len(s2)], '')

    return helpLaceStrings(s1, s2, '')



def McNuggets(n):
	

	a = 0
	b = 0
	c = 0

	for a in range(n):
		for b in range(n):
			for c in range(n):
				if 6*a + 9*b + 20*c == n:
					return True


	return False				



def fixedPoint(f, epsilon):
    """
    f: a function of one argument that returns a float
    epsilon: a small float
  
    returns the best guess when that guess is less than epsilon 
    away from f(guess) or after 100 trials, whichever comes first.
    """
    guess = 1.0
    for i in range(100):
        if abs(f(guess) - guess) < epsilon:
            return guess
        else:
            guess = f(guess)
    return guess






def babylon(a, x):
    def test():
        return 0.5 * ((a / x) + x)
    return test

def sqrt(a):
    return fixedPoint(babylon(a=a), 0.0001)
